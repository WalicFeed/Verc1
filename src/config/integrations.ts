/**
 * Интеграции со сторонними сервисами.
 *
 * ──────────────────────────────────────────────────────────────
 *  GETCOURSE
 * ──────────────────────────────────────────────────────────────
 * GetCourse отдаёт виджет в виде тега вида:
 *
 *   <script id="eb857f9d..." src="https://integralinstitute.ru/pl/lite/widget/script?id=1551511"></script>
 *
 * Чтобы подключить его:
 *   1. Впишите `id` и `src` из вашего тега в `getcourse.widgets` ниже.
 *   2. Кнопки с `widget="<ключ>"` начнут открывать соответствующую форму.
 *
 * Пока список пуст, все кнопки ведут на `fallbackHref` (почта),
 * так что страница остаётся рабочей до подключения виджетов.
 */

export interface GetCourseWidget {
  /** Значение атрибута id из тега <script> */
  scriptId: string;
  /** Значение атрибута src из тега <script> */
  src: string;
  /**
   * CSS-селектор или класс, который GetCourse ожидает на кнопке-триггере.
   * Если виджет открывается сам (например, по клику на любой элемент
   * с определённым классом) — укажите этот класс здесь.
   */
  triggerClass?: string;
}

export const getcourse: {
  enabled: boolean;
  widgets: Record<string, GetCourseWidget>;
} = {
  // Переключите в true после того, как впишете виджеты ниже.
  enabled: false,

  widgets: {
    // Пример — замените на реальные значения из GetCourse:
    //
    // booking: {
    //   scriptId: "eb857f9d0f35d4af59930cf11e6e0d13f633729f",
    //   src: "https://integralinstitute.ru/pl/lite/widget/script?id=1551511",
    //   triggerClass: "gc-open-booking",
    // },
    //
    // route: {
    //   scriptId: "...",
    //   src: "https://integralinstitute.ru/pl/lite/widget/script?id=...",
    //   triggerClass: "gc-open-route",
    // },
  },
};

/** Куда ведут кнопки, пока виджеты GetCourse не подключены. */
export const fallbackHref =
  "mailto:education@integralinstitute.ru?subject=" +
  encodeURIComponent("Участие: Спиральная динамика в Мармарисе, 1–2 сентября 2026");

/** Аналитика — вставьте счётчики, если нужны. */
export const analytics = {
  yandexMetrikaId: "" as string,
  googleAnalyticsId: "" as string,
};
