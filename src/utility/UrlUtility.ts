import UrlParameter from "../types/UrlParameter";

export default class UrlUtility {
  public static ConstructParameterString(params: UrlParameter[]): string {
    let result = '?'

    params.forEach((param, index) => {
      result += param.Name + '=' + encodeURIComponent(param.Value);
      
      if(index < params.length - 1) {
        result += '&';
      }
    });

    return result;
  }
}