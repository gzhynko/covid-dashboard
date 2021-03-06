import { JsonState } from "../types/State";
import UrlParameter from '../types/UrlParameter';
import Constants from '../Constants';
import UrlUtility from "../utility/UrlUtility";
import superagent from 'superagent';
import LatLngBounds from "../types/LatLngBounds";
import StateArray from "../types/StateArray";

export default class APIManager {
  currentRequest: superagent.SuperAgentRequest | null = null;

  public QueryAllStates(): Promise<StateArray> {
    return this.queryStatesWithParameters([]);
  }

  public QueryStatesWithinBounds(bounds: LatLngBounds): Promise<StateArray> {
    const urlParams = new Array<UrlParameter>(
      new UrlParameter('lamin', (bounds.SouthWestCorner.Latitude as number).toString()),
      new UrlParameter('lomin', (bounds.SouthWestCorner.Longitude as number).toString()),
      new UrlParameter('lamax', (bounds.NorthEastCorner.Latitude as number).toString()),
      new UrlParameter('lomax', (bounds.NorthEastCorner.Longitude as number).toString())
    );

    return this.queryStatesWithParameters(urlParams);
  }

  private queryStatesWithParameters(parameters: UrlParameter[]): Promise<StateArray> {
    return new Promise<StateArray>((resolve, reject) => this.queryAPI(Constants.StatesEndpoint, parameters).then((response: string) => {
      const result = (response as any).states;
      const convertedResult = new StateArray();
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
      if(this.currentRequest != null) reject("already_running");

      this.currentRequest = superagent.get(queryUrl);

      this.currentRequest.end((error: string, response: superagent.Response) =>  {
        this.currentRequest = null;

        if(error) reject(error);
        if(response === undefined || response === null) reject("response_undefined");
        
        resolve(response.body);
      });
    });
  }
}
