export default class KeyValuePair<KT, VT> {
  public Key: KT;
  public Value: VT;

  constructor(key: KT, value: VT) {
    this.Key = key;
    this.Value = value;
  }
}