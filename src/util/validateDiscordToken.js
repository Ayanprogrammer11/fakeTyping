export const validateDiscordToken = function (token) {
  const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
  const isValid = token.match(tokenRegex);
  return isValid !== null; // Return true only if there's a match
};
