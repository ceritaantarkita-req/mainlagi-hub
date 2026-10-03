export function orderAccessAllowed(input: {
  guestTokenMatches: boolean;
  accountId: string | null;
  userId: string | null;
}) {
  return (
    input.guestTokenMatches ||
    Boolean(input.accountId && input.userId && input.accountId === input.userId)
  );
}
