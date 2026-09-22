export const CRM_ADAPTER_VERSION='1.0'

// This is the single future CRM integration point. It deliberately performs no
// external request until a provider, credentials and an owner-approved mapping exist.
export async function deliverLeadToCrm(_leadRecord){
  return {configured:false,delivered:false,provider:null}
}
