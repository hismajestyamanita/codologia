import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ymaps: any;
  }
}

const YandexMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = () => {
      if (window.ymaps && mapRef.current) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [64.539, 40.570], // Центр между двумя филиалами
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl']
          });

          // Первая метка - ул. Ломоносова, 199
          const placemark1 = new window.ymaps.Placemark([64.545436, 40.522185], {
            balloonContent: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 8px 0; color: #3D9DF2;">Кодология - Ломоносова</h3>
                <p style="margin: 0 0 8px 0;"><strong>Адрес:</strong> ул. Ломоносова, 199</p>
                <p style="margin: 0 0 8px 0;"><strong>Телефон:</strong> +7 (950) 661-39-51</p>
                <p style="margin: 0;"><strong>Режим работы:</strong> Пн-Вс 9:00-19:00</p>
              </div>
            `,
            hintContent: 'Кодология - ул. Ломоносова, 199'
          }, {
            preset: 'islands#blueEducationIcon',
            iconColor: '#3D9DF2'
          });

          // Вторая метка - пр. Московский, 49 (ТЦ Вертикаль)
          const placemark2 = new window.ymaps.Placemark([64.532575, 40.619167], {
            balloonContent: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 8px 0; color: #3D9DF2;">Кодология - ТЦ Вертикаль</h3>
                <p style="margin: 0 0 8px 0;"><strong>Адрес:</strong> пр. Московский, 49 (ТЦ Вертикаль)</p>
                <p style="margin: 0 0 8px 0;"><strong>Телефон:</strong> +7 (950) 661-39-51</p>
                <p style="margin: 0;"><strong>Режим работы:</strong> Пн-Вс 9:00-19:00</p>
              </div>
            `,
            hintContent: 'Кодология - ТЦ Вертикаль, пр. Московский, 49'
          }, {
            preset: 'islands#blueEducationIcon',
            iconColor: '#7CF23D'
          });

          map.geoObjects.add(placemark1);
          map.geoObjects.add(placemark2);

          // Автоматически подстроить масштаб под все метки
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 50
          });
        });
      }
    };

    // Проверяем, загружен ли API Яндекс.Карт
    if (window.ymaps) {
      initMap();
    } else {
      // Ждем загрузки API
      const checkYmaps = setInterval(() => {
        if (window.ymaps) {
          clearInterval(checkYmaps);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkYmaps);
    }
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-80 rounded-medium overflow-hidden shadow-lg"
      style={{ minHeight: '320px' }}
    />
  );
};

export default YandexMap;