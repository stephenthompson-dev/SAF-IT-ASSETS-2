// assetFormConfig.js

export const assetFormFields = [
    { name: 'asset_name', label: 'Asset Name', type: 'text' },
    { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
    { name: 'category', label: 'Category', type: 'select', options: [] },  // Options will be populated dynamically
  ];
  
  export const initialAssetValues = {
    asset_name: '',
    purchase_date: '',
    category: '',
  };
  