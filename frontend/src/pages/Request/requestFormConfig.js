
export const requestFormFields = [
    { name: 'asset', label: 'Asset', type: 'select', options: [] },  // Options will be populated dynamically
    { name: 'for_date', label: 'For Date', type: 'date' },
    { name: 'end_date', label: 'End Date', type: 'date' },
    // 'approved', 'approved_date', 'approved_by' are handled separately and should be editable only by admins
  ];
  
  export const initialRequestValues = {
    asset: '',
    for_date: '',
    end_date: '',
    further_notice: false,
  };
  