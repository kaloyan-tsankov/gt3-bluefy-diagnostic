'use strict';
const SERVICE = '0000fe86-0000-1000-8000-00805f9b34fb';
const FE01 = '0000fe01-0000-1000-8000-00805f9b34fb';
const FE02 = '0000fe02-0000-1000-8000-00805f9b34fb';
const el = id => document.getElementById(id);
let device = null;
let busy = false;
const supported = window.isSecureContext && typeof navigator.bluetooth?.requestDevice === 'function';
function controls() {
  el('choose').disabled = !supported || busy || !!device?.gatt?.connected;
  el('chooseFe86').disabled = el('choose').disabled;
  el('connect').disabled = busy || !device?.gatt || !!device.gatt.connected;
  el('disconnect').disabled = !device?.gatt?.connected;
}
function disconnected() {
  el('status').textContent = 'GATT е прекъснат. Няма автоматично повторно свързване.';
  controls();
}
function errorText(error) {
  const hints = {
    NotFoundError: 'Изборът е отменен, устройството или исканата услуга не са намерени.',
    NotAllowedError: 'Достъпът е отказан от потребителя или браузъра.',
    SecurityError: 'Провери HTTPS и разрешението за FE86; при нужда избери устройството отново.',
    NetworkError: 'Връзката е недостъпна или е прекъсната. Възможна е заета връзка.',
    NotSupportedError: 'Операцията не се поддържа от тази среда.'
  };
  return `${error.name || 'Грешка'}: ${error.message || ''}\n${hints[error.name] || 'Провери Bluetooth, разрешенията и състоянието на устройството.'}`;
}
el('environment').textContent = supported
  ? 'Защитен контекст · Web Bluetooth API е наличен.'
  : 'Необходим е HTTPS адрес и браузър с Web Bluetooth (например Bluefy).';
async function chooseDevice(fe86Only) {
  if (busy) return;
  busy = true;
  controls();
  try {
    // Called directly from the button gesture. No connection here.
    const selected = await navigator.bluetooth.requestDevice(fe86Only ? {
      filters: [{ services: [SERVICE] }],
      optionalServices: [SERVICE]
    } : {
      acceptAllDevices: true,
      optionalServices: ['0000fe86-0000-1000-8000-00805f9b34fb']
    });
    if (device) device.removeEventListener('gattserverdisconnected', disconnected);
    device = selected;
    device.addEventListener('gattserverdisconnected', disconnected);
    el('name').textContent = device.name || '(няма предоставено име)';
    el('deviceId').textContent = device.id || '(няма предоставен ID)';
    el('result').textContent = 'Няма извършено откриване за избраното устройство.';
    el('status').textContent = device.gatt
      ? 'Устройството е избрано. GATT не е свързан от страницата.'
      : 'Устройството е избрано, но браузърът не предоставя GATT.';
  } catch (error) {
    el('status').textContent = errorText(error) + (fe86Only ? '\nFE86 търсенето показва само устройства, които рекламират услугата. Празен списък не доказва липса на FE86. Предишният избор, ако има такъв, остава активен.' : '');
  }
  finally { busy = false; controls(); }
}
el('choose').addEventListener('click', () => chooseDevice(false));
el('chooseFe86').addEventListener('click', () => chooseDevice(true));
el('connect').addEventListener('click', async () => {
  if (busy || !device?.gatt || device.gatt.connected) return;
  busy = true;
  controls();
  el('result').textContent = 'Откриване…';
  el('status').textContent = 'Свързване с GATT. Откажи евентуално искане за сдвояване.';
  try {
    const server = await device.gatt.connect();
    controls();
    const service = await server.getPrimaryService(SERVICE);
    const characteristics = await service.getCharacteristics();
    const lines = [`Услуга: ${service.uuid}`, ''];
    for (const uuid of [FE01, FE02]) {
      lines.push(`${uuid}: ${characteristics.some(c => c.uuid.toLowerCase() === uuid) ? 'открита' : 'не е открита'}`);
    }
    lines.push('', 'Всички видими характеристики в FE86:');
    const flags = ['read', 'write', 'writeWithoutResponse', 'notify', 'indicate', 'broadcast', 'authenticatedSignedWrites', 'reliableWrite', 'writableAuxiliaries'];
    for (const characteristic of characteristics) {
      const properties = flags.filter(flag => characteristic.properties[flag]);
      lines.push(`${characteristic.uuid}\n  Свойства: ${properties.join(', ') || 'няма предоставени'}`);
    }
    if (!characteristics.length) lines.push('(няма)');
    lines.push('', 'Свойствата са метаданни. Не е прочетена или записана стойност.');
    el('result').textContent = lines.join('\n');
    el('status').textContent = 'Откриването приключи. Натисни „Прекъсни GATT“, когато приключиш.';
  } catch (error) {
    el('result').textContent = errorText(error);
    if (device.gatt.connected) device.gatt.disconnect();
    el('status').textContent = 'Откриването не завърши. Връзката от страницата е прекратена.';
  } finally { busy = false; controls(); }
});
el('disconnect').addEventListener('click', () => {
  if (device?.gatt?.connected) device.gatt.disconnect();
  controls();
});
window.addEventListener('pagehide', () => {
  if (device?.gatt?.connected) device.gatt.disconnect();
});
controls();


