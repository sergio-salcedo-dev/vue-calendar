import { addDays, format } from 'date-fns';

export const EVENTS = [
  {
    event_id: '1',
    date: '2023-01-01',
    title: "New Year's Day",
  },
  {
    event_id: '2',
    date: '2023-01-10',
    title: 'Evento 2',
  },
  {
    event_id: '3',
    date: '2023-02-10',
    title: 'Evento 3',
  },
  {
    event_id: '4',
    date: '2023-03-14',
    title: 'Evento 4',
  },
  {
    event_id: '5',
    date: '2023-03-15',
    title: 'Evento 5',
    description:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    event_id: '6',
    date: '2023-03-17',
    title: 'Evento 6',
    description: '',
  },
  {
    event_id: '7',
    date: '2023-03-20',
    title: 'Evento 7',
    description:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    event_id: '8',
    date: '2023-04-06',
    title: 'Evento 8',
  },
  {
    event_id: '9',
    date: '2023-03-15',
    title: 'Evento 9',
  },
];

/** @param {number} amount */
export const generateRandomEvents = (amount = 20) => {
  if (amount <= 0) {
    throw new Error('the amount of events must be greater than 0');
  }

  const events = [];
  for (let i = 1; i <= amount; i++) {
    events.push({
      event_id: i,
      ...generateRandomEvent(),
    });
  }

  return events;
};

/**
 *
 * @param {number} minValue
 * @param {number} maxValue
 * @return {number}
 */
const generateRandomNumber = (minValue, maxValue) => {
  if (minValue >= maxValue) {
    throw new Error('minValue must be less than maxValue');
  }

  return Math.random() * (maxValue - minValue) + minValue;
};

const generateRandomDate = () => {
  const randomNumber = generateRandomNumber(-100, 100);

  if (randomNumber < 0) {
    return format(addDays(new Date(), -randomNumber), 'yyyy-MM-dd');
  }

  return format(addDays(new Date(), randomNumber), 'yyyy-MM-dd');
};

const generateRandomEvent = () => {
  const titles = ['Meeting', 'Presentation', 'Conference', 'Workshop', 'Training', 'Seminar'];
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Pellentesque vel aliquam metus.',
    'Sed tristique tortor vel felis vehicula, eu iaculis erat convallis.',
    'Donec varius dolor nec quam aliquet, in facilisis velit tristique.',
    'Mauris eu metus et ante volutpat vehicula.',
    'Suspendisse in sapien nec turpis pharetra hendrerit.',
    'Proin ac lacus vel velit volutpat scelerisque.',
    'Nulla facilisi. Donec vel odio velit.',
  ];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription =
    Math.random() < 0.5 ? '' : descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    title: randomTitle,
    description: randomDescription,
    date: generateRandomDate(),
  };
};
