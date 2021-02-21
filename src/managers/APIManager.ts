import State, { JsonState } from "../types/State";
import UrlParameter from '../types/UrlParameter';
import Constants from '../Constants';
import UrlUtility from "../utility/UrlUtility";
import superagent from 'superagent';
import LatLngBounds from "../types/LatLngBounds";

export default class APIManager {
  public QueryAllStates(): Promise<Array<State>> {
    return this.queryStatesWithParameters([]);
  }

  public QueryStatesWithinBounds(bounds: LatLngBounds): Promise<Array<State>> {
    const urlParams = new Array<UrlParameter>(
      new UrlParameter('lamin', (bounds.SouthWestCorner.Latitude as number).toString()),
      new UrlParameter('lomin', (bounds.SouthWestCorner.Longitude as number).toString()),
      new UrlParameter('lamax', (bounds.NorthEastCorner.Latitude as number).toString()),
      new UrlParameter('lomax', (bounds.NorthEastCorner.Longitude as number).toString())
    );

    return this.queryStatesWithParameters(urlParams);
  }

  private queryStatesWithParameters(parameters: UrlParameter[]): Promise<Array<State>> {
    return new Promise<Array<State>>((resolve, reject) => this.queryAPI(Constants.StatesEndpoint, parameters).then((response: string) => {
      const result = (response as any).states;
      const convertedResult = new Array<State>();
      if(result === null) reject();

      result.forEach((jsonState: any) => { 
        const stateObject = new JsonState(jsonState[0], jsonState[1], jsonState[2], jsonState[3], jsonState[4], jsonState[5], 
          jsonState[6], jsonState[7], jsonState[8], jsonState[9], jsonState[10], jsonState[11], jsonState[12], 
          jsonState[13], jsonState[14], jsonState[15], jsonState[16]);
        
        convertedResult.push(stateObject.ToState())
      });

      resolve(convertedResult);
    }, (error: string) => {
      reject(error);
    }));
  }

  private queryAPI(endpoint: string, parameters: UrlParameter[]): Promise<string> {
    const queryUrl = Constants.APIRootURL + endpoint + UrlUtility.ConstructParameterString(parameters);

    return new Promise((resolve, reject) => {
      superagent.get(queryUrl).end((error: string, response: superagent.Response) =>  {
        if(error) reject(error);
        if(response === undefined || response === null) reject();

        resolve(response.body);
      });
    });
  }
}
