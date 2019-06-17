import _ from "lodash";
import {Menu} from "antd";
import {Link} from "react-router";
import React from "react";
const SubMenu = Menu.SubMenu;

export const getMenu = (obj) => {
    let imgURL = null;
    for (let j = 0; j < this.requireContext.keys().length; j++) {
        if (obj.icon && obj.icon.indexOf(this.requireContext.keys()[j].split('/')[1]) > 0) {
            imgURL = this.menuIcon[j];
        }
    }
    if (_.toArray(obj.childs).length > 0) {
        return (
            <SubMenu key={obj.path}
                     title={
                         <div>
                             <img className={this.state.collapsed ? 'index-menu-icon-collapsed' : 'index-menu-icon'}
                                  src={imgURL}/>
                             <span
                                 className={this.state.collapsed ? 'index-menu-span-collapsed' : 'index-menu-span'}>{obj.name}</span>
                         </div>
                     }
            >
                {_.toArray(obj.childs).map((data, index) => {
                        return (
                            <Menu.Item key={obj.path + data.path}>
                                <Link key={obj.path + data.path}
                                      to={obj.path + data.path + `${data.childs ? data.childs[0].path : ''}`}
                                      onClick={this.menuItemClick.bind(this, data)}>
                                    {data.name}
                                </Link>
                            </Menu.Item>
                        )
                    }
                )}
            </SubMenu>
        )
    } else {
        return <Menu.Item key={obj.path}>
            <Link key={obj.path} to={obj.path}>
                <img className='index-menu-icon' src={imgURL}/>
                <span>{obj.name}</span>
            </Link>
        </Menu.Item>
    }
};
