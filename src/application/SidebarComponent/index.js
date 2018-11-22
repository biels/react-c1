import React from 'react';

import { Button, Intent, Icon, Popover } from '@blueprintjs/core';
import MIconTooltip from './components/MIconTooltip';
import css from './main.scss';

import UserCardPopover from './components/UserCardPopover';

const tabs = [
  {icon: 'home', tooltip: 'Inici', path: 'newtab'},
  {icon: 'people', tooltip: 'Pacientes', path: 'patients'},
  {icon: 'tag', tooltip: 'Etiquetas', path: 'labels'},
  {icon: 'map', tooltip: 'Hojas de prescripción', path: 'prescription'},
  {icon: 'database', tooltip: 'Ficheros', path: 'files'},
  {icon: 'full-stacked-chart', tooltip: 'Estadísticas', path: 'statistics'},
  {icon: 'wrench', tooltip: 'Utilidades', path: 'settings'},
  /* {icon: 'cloud', tooltip: '[Reallocate]'},
   {icon: 'control', tooltip: 'Indicaciones', path: 'indicaciones'},
   {icon: 'heatmap', tooltip: 'Complicaciones', path: 'complicaciones'},
   {icon: 'prescription', tooltip: 'Antropometrías', path: 'antropometrias'},
   {icon: 'prescription', tooltip: 'Analíticas', path: 'analiticas'},
   {icon: 'control', tooltip: 'Mantenimientos'},*/
  {icon: 'user', tooltip: 'Login'},
  {icon: 'log-out', tooltip: 'Exit', path: 'logout'},
  {icon: 'delete', tooltip: 'Exit'},
];

// @connect(state => ({menuIndex: state.application.menuIndex}))
export default class SidebarComponent extends React.PureComponent {

  dispatchLogout = () => {
    /*this.props.dispatch({
      type: 'LOGOUT_REQUEST'
    });*/
    localStorage.setItem("pass",false);
    this.forceUpdate();

  }

  dispatchSelectItem = (index) => () => {
    if (tabs[index].path === 'logout') {
      this.dispatchLogout()
    }
    this.props.dispatch({
      type: 'SELECT_MENU_ITEM',
      payload: {index}
    });

  }

  render() {
    const bottomCount = 3;

    const index = this.props.menuIndex || -1;
    const iconTags = tabs.map((s, i) => {
      let iconComponent;
      if (s.icon === 'user') {
        let userPreview = <Icon className={css.innerIcon} icon={s.icon} iconSize={Icon.SIZE_LARGE}/>;
        if(true)userPreview = <div className={css.profilePicture}/>
        iconComponent = () => <Popover
                  target={userPreview}
                  content={<UserCardPopover/>}
              />
      }

      if (iconComponent == null) iconComponent = () => <MIconTooltip data={s.tooltip} icon={s.icon}
                                                                     intent={i === index ? Intent.PRIMARY : Intent.NONE}/>;
      return (
        <Link key={i} to={"/" + s.path}>
          <div className={i === index ? css.selectedIcon : css.icon} onClick={this.dispatchSelectItem(i)}>

            {iconComponent()}

            {/*<Icon className={css.innerIcon} iconName={s.icon} iconSize={Icon.SIZE_LARGE}*/}
            {/*intent={i === index ? Intent.PRIMARY : Intent.NONE}/>*/}

          </div>
        </Link>
      );
    });
    const topIcons = iconTags.slice(0, iconTags.length - bottomCount);
    const bottomIcons = iconTags.slice(iconTags.length - bottomCount);
    return (
      <div className={css.container}>
        <div className={css.logo}>
          F
        </div>
        <div className={css.tabContainer}>
          <div className={css.tabsGroup}>
            {topIcons}
          </div>
          <div className={css.bottomGroup}>
            {bottomIcons}
          </div>
        </div>
      </div>

    );
  }
}
