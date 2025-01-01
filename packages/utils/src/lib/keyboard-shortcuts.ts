export function checkPushToTalkActive(event: KeyboardEvent) {
  return event.altKey && event.shiftKey && event.code === 'KeyU';
}

export function checkPushToTalkInactive(event: KeyboardEvent) {
  return event.altKey || event.shiftKey || event.code === 'KeyU';
}
