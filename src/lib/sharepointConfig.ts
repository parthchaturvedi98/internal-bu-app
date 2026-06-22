// Fill this in after creating your SharePoint site
// Format: "yourtenant.sharepoint.com:/sites/YourSiteName:"
// Example: "hcltech.sharepoint.com:/sites/BUTracker:"
export const SP_SITE = 'REPLACE_WITH_SHAREPOINT_HOST:/sites/REPLACE_WITH_SITE_NAME:';

// These are the exact list names you created in SharePoint
export const SP_LISTS = {
  accounts: 'BU Accounts',
  timeline: 'Timeline Entries',
};

// Graph API base for list items
export function accountsUrl() {
  return `/sites/${SP_SITE}/lists/${encodeURIComponent(SP_LISTS.accounts)}/items`;
}

export function timelineUrl() {
  return `/sites/${SP_SITE}/lists/${encodeURIComponent(SP_LISTS.timeline)}/items`;
}
