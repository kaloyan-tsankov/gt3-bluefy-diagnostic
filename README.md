# GT 3 · Bluefy диагностика

Статична страница без зависимости. index.html и app.js трябва да са в една папка. Отвори публикувания HTTPS адрес директно в Bluefy на iPhone, а не като локален файл или вграден преглед.

## Тест
1. Включи Bluetooth и разреши Bluetooth достъп за Bluefy, ако бъде поискан.
2. Остави Huawei Health и съществуващото сдвояване без промени.
3. Натисни „Избери устройство“. Изборът не извиква GATT connect.
4. Провери името/ID. Не избирай произволно чуждо устройство.
5. Само ако желаеш, натисни „Свържи GATT и открий“.
6. При системно искане за pairing/сдвояване избери „Отказ“. Страницата не може да управлява системните диалози.
7. Прегледай FE86 и наличието на FE01/FE02, после натисни „Прекъсни GATT“.

Откриват се само GATT метаданни. Няма readValue, writeValue, startNotifications, pairing API, HiChain или протоколни команди. Служебните GATT заявки за свързване и откриване са необходими и не са пасивно сканиране. При неуспех страницата прекъсва своята връзка. При успех връзката остава до натискане на бутона, напускане на страницата или системно прекъсване; поведението на iOS при затваряне не е гарантирано.

Достъпът до услугата не доказва поддръжка на качване на снимки. optionalServices е разрешение, не филтър или гаранция за налична услуга. Името/ID не удостоверяват модел или собственик. Съвместната работа с Huawei Health зависи от часовника и iOS. Тази версия не е проверена с физически iPhone/GT 3.

## GitHub Pages
Хранилището и страницата са публични. Адрес: https://kaloyan-tsankov.github.io/gt3-bluefy-diagnostic/ . Не качвай лични данни или резултати с идентификатори.

„Търси само FE86“ използва филтър по рекламирана услуга FE86. Ако часовникът не я рекламира, няма да се появи. Резултатът не удостоверява модела или собственика. Изборът не свързва GATT; за това има отделен бутон.

Настройки:
1. Качи index.html, app.js и .nojekyll в корена на main (съдържанието на папката, не ZIP файла).
2. Settings → Pages → Build and deployment → Source: Deploy from a branch.
3. Branch: main; folder: / (root); Save.
4. След успешното публикуване използвай адреса, показан от GitHub Pages. Обичайна форма: https://USERNAME.github.io/gt3-bluefy-diagnostic/.
5. Провери Settings → Pages → Enforce HTTPS и използвай HTTPS адреса.
6. Отвори адреса директно в Bluefy и изпълни теста по-горе.

Източници:
- Web Bluetooth: https://developer.chrome.com/docs/capabilities/bluetooth
- Спецификация: https://bluetooth.spec.whatwg.org/
- Bluefy: https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- HTTPS: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https


