import { IoStatsChart, IoMap, IoList, IoHome } from 'react-icons/io5';

export const SidebarData = [
  {
    title: 'Dashboard Principal',
    path: '/',
    icon: <IoHome />,
    cName: 'nav-text'
  },
  {
    title: 'Mapa de Parcelas',
    path: '/mapa-parcelas',
    icon: <IoMap />,
    cName: 'nav-text'
  },
  {
    title: 'Parcelas Eliminadas',
    path: '/parcelas-eliminadas',
    icon: <IoList />,
    cName: 'nav-text'
  }
];