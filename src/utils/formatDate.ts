
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatYear = (dateString: string): string => {
  return new Date(dateString).getFullYear().toString();
};
