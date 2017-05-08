export function toUTC (date = new Date()) {
  return moment(date).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z');
}