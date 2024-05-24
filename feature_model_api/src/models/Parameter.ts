export default class Parameter {
  private name: string;
  private feature: string;
  private type: string;
  private defaultValue: string;
  private options?: string[];
  private min?: number;
  private max?: number;
  private step?: number;

  constructor(
    name: string,
    feature: string,
    type: string,
    defaultValue: string,
    options?: string[],
    min?: number,
    max?: number,
    step?: number
  ) {
    this.name = name;
    this.feature = feature;
    this.type = type;
    this.defaultValue = defaultValue;
    this.options = options;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}
