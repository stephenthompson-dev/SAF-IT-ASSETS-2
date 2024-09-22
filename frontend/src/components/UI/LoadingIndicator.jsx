const LoadingIndicator = () => (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
  
  export default LoadingIndicator;
  