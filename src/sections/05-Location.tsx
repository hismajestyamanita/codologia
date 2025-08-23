import React from 'react';
import { MapPin, Clock, Bus, Phone } from 'lucide-react';
import YandexMap from '../shared/YandexMap';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';

const Location = () => {
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const mapAnimation = useScrollAnimation({ delay: 200 });
  const { containerRef: infoRef, visibleItems: visibleInfo } = useStaggeredAnimation(5, 400, 150);

  const locations = [
    {
      name: 'Филиал на Ломоносова',
      address: 'ул. Ломоносова, 199',
      phone: '+7 (950) 661-39-51',
      description: 'Основной филиал в центре города'
    },
    {
      name: 'Филиал в ТЦ Вертикаль',
      address: 'пр. Московский, 49 (ТЦ Вертикаль)',
      phone: '+7 (950) 661-39-51',
      description: 'Удобное расположение в торговом центре'
    }
  ];

  return (
    <section className="w-full bg-brand-white relative">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col gap-6">
        <div className="text-center mb-8">
          <h2 
            ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
          >
            Два филиала в&nbsp;Архангельске —{' '}
            <span className="text-brand-blue">удобно после школы</span>{' '}
            и&nbsp;по&nbsp;выходным
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-center w-full">
          <div 
            ref={mapAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`lg:order-1 animate-on-scroll ${mapAnimation.isVisible ? 'visible' : ''}`}
          >
            <YandexMap />
          </div>

          <div 
            ref={infoRef as React.RefObject<HTMLDivElement>}
            className="lg:order-2 space-y-4"
          >
            <div className="flex flex-col gap-4">
              {locations.map((location, index) => (
                <div 
                  key={index} 
                  className={`bg-system-gray-50 p-6 rounded-small animate-on-scroll ${visibleInfo[index] ? 'visible' : ''}`}
                  className={`bg-system-gray-50 p-6 rounded-small animate-on-scroll ${visibleInfo[index] ? 'visible' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-brand-black mb-1">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone className="w-4 h-4" />
                        <span>{location.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Bus className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-black mb-1">
                    Удобная транспортная доступность
                  </h3>
                  <p className="text-xs text-gray-600">
                    Оба филиала находятся рядом с остановками общественного транспорта
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-black mb-1">
                    Удобное расписание
                  </h3>
                  <p className="text-xs text-gray-600">
                    Занятия после уроков в будни и утром по выходным. 
                    Подберём время под ваш график.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-green bg-opacity-10 p-6 rounded-small">
              <h3 className="text-sm font-semibold text-brand-black mb-1">
                Бесплатная парковка
              </h3>
              <p className="text-xs text-gray-600">
                Для родителей, которые привозят детей на машине
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;