// Method to return 1000 to 1K, and 1000000 to 1M and so on.
// The param must be type of number.
export function numberToSI(num) {
  const suffixes = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];

  for (let i = 0; i < suffixes.length; i++) {
    if (num >= suffixes[i].value) {
      let formattedNum = (num / suffixes[i].value).toFixed(2);
      if (formattedNum.endsWith(".00")) {
        formattedNum = formattedNum.slice(0, -3);
      }
      return formattedNum + suffixes[i].symbol;
    }
  }

  return num?.toString();
}

// Convert miliseconds timestamp to date like Mon/Day/Year 11/04/2024
// The param must be of type number
export function timestampToDateString(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${month}/${day}/${year}`;
}

//Convert The size with actual Size
export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const addProtocol = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// Input as number and get the ordinal suffix
export function getOrdinalSuffix(number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = number % 100;
  return (
    number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
  );
}

// Function to format the number with commas
export const formatNumber = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
