import axios from 'axios';
import cheerio from 'cheerio';
import * as qs from 'querystring';

const VOTER_CHECK_URL = 'https://www.votercheck.necvr.ne.gov/VoterView/PollingPlaceSearch.do';

const getSessionCookie = async (): Promise<string> => {
  const response = await axios.get(VOTER_CHECK_URL);
  return response.headers['set-cookie'][0].split(';')[0];
};

const createRequestObject = (
  streetAddress: string,
  zipCode: string,
  countyCode: 301400 | 301600
) => {
  return {
    action: '',
    address: streetAddress,
    county: countyCode,
    countyRequired: true,
    electionCombo: '48463_200000',
    fullElectionListShort: '48463_200000,11/06/18 General 2018...;',
    selectSearchCriteria: 2,
    zipcode: zipCode
  };
};

const fetchPollingPlace = async (
  streetAddress: string,
  zipCode: string,
  countyCode: 301400 | 301600,
  sessionCookie
): Promise<{ name: string; address: string }> => {
  const request = createRequestObject(streetAddress, zipCode, countyCode);
  const pollingResponse = await axios.post(VOTER_CHECK_URL, qs.stringify(request), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: sessionCookie
    }
  });

  const $ = cheerio.load(pollingResponse.data);

  const name = $('span.label:contains(Name)')
    .last()
    .next()
    .text();

  const address = $('span.label:contains(Address)')
    .first()
    .next()
    .html()
    .split('<br>')[0];

  return {
    name,
    address
  };
};

export default {
  fetchPollingPlace,
  getSessionCookie
};
