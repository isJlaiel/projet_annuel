import { Attribute } from "../types/attribute.js";
import { Feature } from "../models/feature.js";
import { FeatureModel } from "../models/featureModel.js";
import SubFeature from "../models/subFeature.js";
import { FeatureRepository } from "../repositories/featureRepository.js";
import Parameter from "../models/Parameter.js";
export class FeatureService {
  private featureRepository: FeatureRepository;
  private config;
  constructor({ featureRepository }: { featureRepository: FeatureRepository }) {
    this.featureRepository = featureRepository;
  }

  public async parseFromXMLToFeatures(): Promise<FeatureModel> {
    try {
      const result = await this.featureRepository.loadXML(
        "src/storage/configurationFiles/model.xml"
      );
      if (result && result.FeatureModel && result.FeatureModel.Features) {
        const name: string = result.FeatureModel.$.name;
        const features: Feature[] = this.parseFeatures(
          result.FeatureModel.Features[0].Feature
        );
        if (result.FeatureModel.Parameters) {
          const parameters: Parameter[] = this.parseParameters(
            result.FeatureModel.Parameters[0].Parameter
          );
          return new FeatureModel(name, features, parameters);
        }
        return new FeatureModel(name, features);
      }
      return;
    } catch (error) {
      console.error("Erreur lors de l'analyse XML :", error);
      return;
    }
  }

  private parseFeatures(featuresData: any): Feature[] {
    const features: Feature[] = featuresData.map((feature: any) => {
      const attributes: Attribute = feature.$ || {};
      const subFeatures: SubFeature = this.parseSubFeatures(feature.subFeature);
      return new Feature(attributes, subFeatures);
    });
    return features;
  }

  parseSubFeatures(subFeaturesData: any): SubFeature {
    if (!subFeaturesData || subFeaturesData.length === 0) {
      return new SubFeature();
    }
    const parsedSubFeatures: SubFeature = subFeaturesData.map((subFeature) => {
      const subFeatureType = subFeature.$?.type;
      const features = subFeature.Feature
        ? this.parseFeatures(subFeature.Feature)
        : [];
      const subFeatures = subFeature.subFeature
        ? subFeature.subFeature.map((s) => {
            const _subFeatures = s.subFeature
              ? this.parseSubFeatures(s.subFeature)
              : {};
            const _features = subFeature.Feature
              ? this.parseFeatures(s.Feature)
              : [];

            return new SubFeature(s.$?.type, _features, _subFeatures);
          })
        : [];
      return new SubFeature(subFeatureType, features, subFeatures);
    });

    return parsedSubFeatures[0];
  }

  private parseParameters(parametersData: any): Parameter[] {
    const parameters: Parameter[] = parametersData.map((parameter: any) => {
      const name: string = parameter.$.name;
      const feature: string = parameter.$.feature;
      let options: string[] = [];
      let min: number = null;
      let max: number = null;
      let step: number = null;
      if (parameter.defaultValue[0].$.options) {
        options = parameter.defaultValue[0].$.options.split(",");
      }
      if (parameter.defaultValue[0].$.min) {
        min = Number(parameter.defaultValue[0].$.min);
      }
      if (parameter.defaultValue[0].$.max) {
        max = Number(parameter.defaultValue[0].$.max);
      }
      if (parameter.defaultValue[0].$.step) {
        step = Number(parameter.defaultValue[0].$.step);
      }
      
      let defaultValue: string = parameter.defaultValue[0]._;
      const type: string = parameter.defaultValue[0].$.type;
      return new Parameter(
        name,
        feature,
        type,
        defaultValue,
        options,
        min,
        max,
        step
      );
    });
    return parameters;
  }

  async configureFeatures(features: any): Promise<void> {
    const xmlData = await this.featureRepository.loadXML(
      "src/storage/configurationFiles/config.xml"
    );
    this.config = xmlData.configuration;

    const teachers: string[] = [
      "no-teacher",
      "single-teacher",
      "multi-teacher",
    ];
    const rooms: string[] = ["no-room", "single-room", "multi-room"];
    const teachersConfig = features.filter(
      (e) =>
        e.selected === true &&
        e.parent === "teaching" &&
        teachers.includes(e.label)
    );
    const roomsConfig = features.filter(
      (e) =>
        e.selected === true && e.parent === "hosting" && rooms.includes(e.label)
    );

    if (teachersConfig.length || roomsConfig.length) {
      let teacherRoomCombinaisons = [];
      if (teachersConfig.length && !roomsConfig.length) {
        for (let j = 0; j < teachersConfig.length; ++j) {
          let key = "no-room_" + teachersConfig[j].label.trim();
          if (this.teacherRoomCombinaison[key]) {
            teacherRoomCombinaisons = [
              ...teacherRoomCombinaisons,
              ...this.teacherRoomCombinaison[key](),
            ];
          }
        }
      } else if (roomsConfig.length && !teachersConfig.length) {
        for (let j = 0; j < roomsConfig.length; ++j) {
          let key = roomsConfig[j].label.trim() + "_no-teacher";
          if (this.teacherRoomCombinaison[key]) {
            teacherRoomCombinaisons = [
              ...teacherRoomCombinaisons,
              ...this.teacherRoomCombinaison[key](),
            ];
          }
        }
      } else if (teachersConfig.length && roomsConfig.length) {
        for (let i = 0; i < roomsConfig.length; ++i) {
          for (let j = 0; j < teachersConfig.length; ++j) {
            let key =
              roomsConfig[i].label.trim() +
              "_" +
              teachersConfig[j].label.trim();
            if (this.teacherRoomCombinaison[key]) {
              teacherRoomCombinaisons = [
                ...teacherRoomCombinaisons,
                ...this.teacherRoomCombinaison[key](),
              ];
            } else {
              console.log("No action defined for:", key);
            }
          }
        }
      }
      this.config["part-dimension"][0].part = teacherRoomCombinaisons;
    }
    const featuresSelected = features.filter(
      (e) =>
        e.selected === true &&
        !teachers.includes(e.label) &&
        !rooms.includes(e.label)
    );
    if (featuresSelected.some((feature) => feature.label == "single-week")) {
      const index: number = featuresSelected.findIndex(
        (feature) => feature.label == "full-period"
      );
      if (index !== -1) {
        featuresSelected.splice(index, 1);
      }
    }
    for (let feature of featuresSelected) {
      if (this.configurationActions[feature.parent]) {
        this.configurationActions[feature.parent](feature);
      }
    }
    xmlData.configuration = this.config;
    await this.featureRepository.generateInstance(xmlData);
  }

  private teacherRoomCombinaison: { [key: string]: () => any } = {
    "no-room_no-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "0" && p.$.nrRooms == "0"
      ),
    "no-room_single-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "1" && p.$.nrRooms == "0"
      ),
    "no-room_multi-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers > 1 && p.$.nrRooms == "0"
      ),
    "single-room_no-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "0" && p.$.nrRooms == "1"
      ),
    "single-room_single-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "1" && p.$.nrRooms == "1"
      ),
    "single-room_multi-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers > 1 && p.$.nrRooms == "1"
      ),
    "multi-room_no-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "0" && p.$.nrRooms > 1
      ),
    "multi-room_single-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers == "1" && p.$.nrRooms > 1
      ),
    "multi-room_multi-teacher": () =>
      this.config["part-dimension"][0].part.filter(
        (p) => p.$.nrTeachers > 1 && p.$.nrRooms > 1
      ),
  };

  private configurationActions: {
    [key: string]: (featureSelected: any) => void;
  } = {
    courses: () => this.configureCourses(),
    timing: (featureSelected) => this.configureTiming(featureSelected),
    scheduling: (featureSelected) => this.configureScheduling(featureSelected),
    hosting: (featureSelected) => this.configureHosting(featureSelected),
    teaching: (featureSelected) => this.configureTeaching(featureSelected),
    attending: (featureSelected) => this.configureAttending(featureSelected),
  };

  private configureCourses() {
    this.config["part-composition"][0].composition = this.config[
      "part-composition"
    ][0].composition.filter((cp) => cp.$.value == "CM" || cp.$.value == "TD");
    const valuesCompostion = this.config["part-composition"][0].composition.map(
      (cp) => cp.$.name
    );
    const regex = new RegExp(
      valuesCompostion.map((value) => `{${value}:[^}]*}`).join("|"),
      "g"
    );

    this.config["formation-composition"][0].distribution = this.config[
      "formation-composition"
    ][0].distribution.map(function (ds) {
      const elements = [];
      const matches = ds._.replace(/\s+/g, "").match(regex);
      if (matches) {
        elements.push(...matches);
      }
      return { ...ds, _: elements.join(",") };
    });
    this.config["part-dimension"][0].part = this.config[
      "part-dimension"
    ][0].part.filter((p) => p.$.id === "CM" || p.$.id === "TD");
    this.config["departement-composition"][0].departement = this.config[
      "departement-composition"
    ][0].departement.map((d) => {
      return {
        ...d,
        etape: d.etape.map((e) => {
          const elements = [];
          const matches = e._.replace(/\s+/g, "").match(regex);

          if (matches) {
            elements.push(...matches);
          }

          return { ...e, _: elements.join(",") };
        }),
      };
    });
  }

  private configureTiming(featureSelected) {
    if (featureSelected.label === "full-period") {
      const nrPeriods = featureSelected.parameters.find(
        (e) => e.key == "nrPeriods"
      ).value;
      this.config.distributionWeeks[0].distributionWeek =
        this.config.distributionWeeks[0].distributionWeek.map((ds) => {
          return { ...ds, _: nrPeriods };
        });
    }
    if (featureSelected.label === "single-week") {
      this.config.distributionWeeks[0].distributionWeek =
        this.config.distributionWeeks[0].distributionWeek.map((ds) => {
          return { ...ds, _: 1 };
        });
    }
    if (featureSelected.label === "full-week") {
      this.config["days"][0] = "7";
    }
  }
  private configureScheduling(featureSelected) {
    if (featureSelected.label === "same-duration") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "same-duration"
      ).$.activate = "1";
    }

    if (featureSelected.label === "no-overlap") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "no-overlap"
      ).$.activate = "1";
    }

    if (featureSelected.label === "modular") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "modular"
      ).$.activate = "1";
    }
  }
  private configureHosting(featureSelected) {
    if (featureSelected.label === "room-capacity") {
      delete this.config.roomSize;
    } else if (featureSelected.label === "all-exclusive") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "all-exclusive"
      ).$.activate = "1";
    } else if (featureSelected.label === "some-exclusive") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "some-exclusive"
      ).$.activate = "1";
    } else if (featureSelected.label === "none-exclusive") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "none-exclusive"
      ).$.activate = "1";
    } else {
      console.log("No action defined for: " + featureSelected.label);
    }
  }
  private configureTeaching(featureSelected) {
    if (featureSelected.label === "session-overlap") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "teaching-session-overlap"
      ).$.activate = "1";
    }
  }
  private configureAttending(featureSelected) {
    if (featureSelected.label === "session-overlap") {
      this.config.features[0].feature.find(
        (e) => e.$.name == "attending-session-overlap"
      ).$.activate = "1";
    }
  }
}
