export const getRequestStatusVariant = (status: string) => {
  switch (status) {
    case "Submitted":
      return "outline";
    case "Completed":
      return "default";
    case "Cancelled":
    case "Rejected":
      return "secondary";
    case "Error":
      return "destructive";
    default:
      return "outline";
  }
};

export const getRequestPriorityVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "outline";
  }
};
