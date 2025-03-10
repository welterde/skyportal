import messageHandler from "baselayer/MessageHandler";

import * as API from "../API";
import store from "../store";

const REFRESH_INSTRUMENT = "skyportal/REFRESH_INSTRUMENT";

const FETCH_INSTRUMENT = "skyportal/FETCH_INSTRUMENT";
const FETCH_INSTRUMENT_OK = "skyportal/FETCH_INSTRUMENT_OK";

const SUBMIT_INSTRUMENT = "skyportal/SUBMIT_INSTRUMENT";

const MODIFY_INSTRUMENT = "skyportal/MODIFY_INSTRUMENT";

const FETCH_INSTRUMENT_SKYMAP = "skyportal/FETCH_INSTRUMENT_SKYMAP";

export const fetchInstrument = (id) =>
  API.GET(`/api/instrument/${id}`, FETCH_INSTRUMENT);

export const submitInstrument = (run) =>
  API.POST(`/api/instrument`, SUBMIT_INSTRUMENT, run);

export const modifyInstrument = (id, params) =>
  API.PUT(`/api/instrument/${id}`, MODIFY_INSTRUMENT, params);

export function fetchInstrumentSkymap(id, localization, airmassTime = null) {
  if (airmassTime) {
    return API.GET(
      `/api/instrument/${id}?includeGeoJSONSummary=True&localizationDateobs=${localization.dateobs}&localizationName=${localization.localization_name}&airmassTime=${airmassTime}`,
      FETCH_INSTRUMENT_SKYMAP
    );
  }

  return API.GET(
    `/api/instrument/${id}?includeGeoJSONSummary=True&localizationDateobs=${localization.dateobs}&localizationName=${localization.localization_name}`,
    FETCH_INSTRUMENT_SKYMAP
  );
}

// Websocket message handler
messageHandler.add((actionType, payload, dispatch, getState) => {
  const { instrument } = getState();
  if (actionType === REFRESH_INSTRUMENT) {
    const { instrument_id } = payload;
    if (instrument_id === instrument?.id) {
      dispatch(fetchInstrument(instrument_id));
    }
  }
});

const reducer = (state = { assignments: [] }, action) => {
  switch (action.type) {
    case FETCH_INSTRUMENT_OK: {
      const instrument = action.data;
      return {
        ...state,
        ...instrument,
      };
    }
    default:
      return state;
  }
};

store.injectReducer("instrument", reducer);
