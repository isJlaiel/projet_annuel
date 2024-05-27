export class ParameterValue {
  private key: string;
  private value: string;
  private min?: string;
  private max?: string;
  private step?: string;

  constructor(key: string, value: string, min?: string, max?: string, step?: string) {
    this.key = key;
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}

export default class Parameter {
  private feature: string;
  private type: string;
  private values: ParameterValue[];

  constructor(feature: string, type: string, values: ParameterValue[]) {
    this.feature = feature;
    this.type = type;
    this.values = values;
  }
}