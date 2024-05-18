import * as xml2js from 'xml2js';
import { Attribute } from "../types/attribute.js";
import { Feature } from '../models/feature.js';
import { FeatureModel } from '../models/featureModel.js';
import SubFeature from '../models/subFeature.js';
import {  promises as fs } from 'fs';
import { FeatureRepository } from '../repositories/featureRepository.js';

type RoomType = "no-room" | "single-room" | "multi-room";
type TeacherType = "no-teacher" | "single-teacher" | "multi-teacher";

export class FeatureService {

    private  featureRepository :FeatureRepository ;
    private  config ;
    constructor({featureRepository }:{ featureRepository :FeatureRepository}){
        this.featureRepository=featureRepository ;
    }
    public  async parseFromXMLToFeatures(): Promise<FeatureModel> {
        try {
            const result = await this.featureRepository.loadXML('src/storage/model.xml');
            if (result && result.FeatureModel && result.FeatureModel.Features) {
                const name : string = result.FeatureModel.$.name ;
                const features : Feature[] = this.parseFeatures(result.FeatureModel.Features[0].Feature)
                return new FeatureModel(name,features);
            }
            return;
        } catch (error) {
            console.error('Erreur lors de l\'analyse XML :', error);
            return ;
        }
    }
 
    private parseFeatures(featuresData: any): Feature[] {
        const features: Feature[] = featuresData.map((feature: any) => {
            const attributes: Attribute = feature.$ || {};
            const subFeatures : SubFeature = this.parseSubFeatures(feature.subFeature); 
            return new Feature(attributes, subFeatures);
        });
    
    return features;
    }
 
    parseSubFeatures(subFeaturesData: any): SubFeature {
        if (!subFeaturesData || subFeaturesData.length === 0) {
            return new SubFeature();
        }
        const parsedSubFeatures : SubFeature = subFeaturesData.map(subFeature => {
            const subFeatureType = subFeature.$?.type;
            const features = subFeature.Feature ? this.parseFeatures(subFeature.Feature) : []
            const subFeatures = subFeature.subFeature ? subFeature.subFeature.map(s => {
                const _subFeatures = s.subFeature ? this.parseSubFeatures(s.subFeature) : {};
                const _features = subFeature.Feature ? this.parseFeatures(s.Feature) : []

                return new SubFeature(s.$?.type,_features, _subFeatures);
            }) : [];
            return new SubFeature(subFeatureType, features, subFeatures);
        });
    
        return parsedSubFeatures[0];
    }
    
     async configureFeatures(features : any) {
        // const featuresSelected = features.filter((e)=> e.selected === true)
        const parser =  new xml2js.Parser();

        const xmlConfig = (await fs.readFile('src/storage/config.xml', 'utf-8')).replace(/^\s+</, '<');
        const config =  (await parser.parseStringPromise(xmlConfig)).configuration;
        // const config = (await this.featureRepository.loadXML('src/storage/config.xml')).configuration;
        console.log(config)
        // for (let feature of featuresSelected){
        //     if(this.configurationActions[feature.parent]){
        //         this.configurationActions[feature.parent](feature)}
        // }

        const course_hierarchy =features.find((e) => e.label === "course-hierarchy");
        if(course_hierarchy && course_hierarchy.selected){
            config['part-composition'][0].composition =  config['part-composition'][0].composition.filter(cp => cp.$.value == "CM" ||cp.$.value == "TD"  )

        }

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(config);
        console.log(xml)
    try {
        fs.writeFile('fichier_modifie.xml', xml)

    } catch (error) {
        console.log(error)
    }
    //     const full_week =featuresSelected.find((e) => e.label === "full-week");
    //     if(full_week?.selected){
    //         this.config['days'][0] = "7" ;

    //     }
    //     const full_period =featuresSelected.find((e) => e.label === "full-period");
    //     if(full_period?.selected){
    //         const nrPeriods = full_period.parameters.find(e => e.key  == "nrPeriods").value ;
    //          this.config.distributionWeeks[0].distributionWeek =  this.config.distributionWeeks[0].distributionWeek.map(ds =>{
    //             return {...ds, _ : nrPeriods}; }  );
    //          console.log(this.config.distributionWeeks[0].distributionWeek)

    //     }
    //     const single_week =featuresSelected.find((e) => e.label === "single-week");
    //     if(single_week?.selected){
    //          this.config.distributionWeeks[0].distributionWeek =  this.config.distributionWeeks[0].distributionWeek.map(ds =>{
    //             return {...ds, _ : 1}; }  );

    //     }
    //     const same_duration  = featuresSelected.find((e) => e.label === "same-duration");

    //     if(same_duration?.selected){
    //         this.config.features[0].feature.find(e => e.$.name  == "same-duration").$.activate = "1" 

    //    }

    //    const no_overlap  = featuresSelected.find((e) => e.label === "no-overlap");
    //     if(no_overlap?.selected){
    //         this.config.features[0].feature.find(e => e.$.name  == "no-overlap").$.activate = "1" 
    //    }
    //    const modular  = featuresSelected.find((e) => e.label === "modular");

    //    if(modular?.selected){
    //     this.config.features[0].feature.find(e => e.$.name  == "modular").$.activate = "1" 
    //     }

    //     const all_exclusive  = featuresSelected.find((e) => e.label === "all-exclusive");
    //    console.log(all_exclusive);
    //     if(all_exclusive?.selected){
    //      this.config.features[0].feature.find(e => e.$.name  == "all-exclusive").$.activate = "1" 
    //      }
 
    //      const some_exclusive  = featuresSelected.find((e) => e.label === "some-exclusive");
    //      if(some_exclusive?.selected){
    //       this.config.features[0].feature.find(e => e.$.name  == "some-exclusive").$.activate = "1" 
    //       }
    //       const none_exclusive  = featuresSelected.find((e) => e.label === "none-exclusive");

    //       if(none_exclusive?.selected){
    //        this.config.features[0].feature.find(e => e.$.name  == "none-exclusive").$.activate = "1" 
    //        }
    //        const room_capcity  = featuresSelected.find((e) => e.label === "room-capacity");

    //        if(room_capcity.selected){
    //         delete  this.config.roomSize;
    //         }
    //         const teacher_option = featuresSelected.filter((e)=>/-teacher$/.test(e.label ) && e.selected)
    //         const room_option = featuresSelected.filter((e)=> /-room$/.test(e.label) && e.selected)
    //         console.log(teacher_option)
    //         console.log(room_option)
            
    //         // for(teache)

    //     // delete result.nomDeLaBalise;

    //     // // Modifier un attribut
    //     // if (result.laBalise && result.laBalise[0].$) {
    //     //     result.laBalise[0].$.attribut = 'nouvelleValeur';
    //     // }
        
    }

    private static TeacherHostCombinaison: {[key: string]: () => any} = {
        "no-room_no-teacher": () => console.log("Aucune salle, aucun enseignant: Action A"),
        "no-room_single-teacher": () => console.log("Aucune salle, un enseignant: Action B"),
        "no-room_multi-teacher": () => console.log("Aucune salle, plusieurs enseignants: Action C"),
        "single-room_no-teacher": () => console.log("Une salle, aucun enseignant: Action D"),
        "single-room_single-teacher": () => console.log("Une salle, un enseignant: Action E"),
        "single-room_multi-teacher": () => console.log("Une salle, plusieurs enseignants: Action F"),
        "multi-room_no-teacher": () => console.log("Plusieurs salles, aucun enseignant: Action G"),
        "multi-room_single-teacher": () => console.log("Plusieurs salles, un enseignant: Action H"),
        "multi-room_multi-teacher": () => console.log("Plusieurs salles, plusieurs enseignants: Action I"),
    };

    private  configurationActions: {[key: string]: (featureSelected: any) => void} = {
        "courses": () => this.configureCourses(),
        "timing": () => this.configureTiming,
        "scheduling": () => this.configureScheduling,
        "hosting": () => this.configureHosting,
        "teaching": () => this.configureTeaching,
        "attending": () => this.configureAttending,
    };

    private configureCourses(){
        // console.log("hey")
        // this.config['part-composition'][0].composition =  this.config['part-composition'][0].composition.filter(cp => cp.$.value == "CM" ||cp.$.value == "TD"  )
        // console.log(this.config['part-composition'][0].composition)

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(this.config);
        console.log(xml)
    try {
        fs.writeFile('fichier_modifie.xml', xml)

    } catch (error) {
        console.log(error)
    }
    }

    private configureTiming(){

    }
    private configureScheduling(){

    }
    private configureHosting(){

    }
    private configureTeaching(){

    }
    private configureAttending(){

    }
    

}


