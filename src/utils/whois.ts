import axios from 'axios';
import type { WhoisResponse } from '../types/whois';

export async function getWhoisInfo(domain: string): Promise<WhoisResponse> {
  const response = await axios.post('https://whoiscx.com/api/whois/info/', {
    domain
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
}
