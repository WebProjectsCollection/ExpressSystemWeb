
/**
 * 用户数据
 */
export class UserData {
  //用户名
  userName: string;

  //头像
  userAvatar: string;

  //手机
  mobilePhone: string;

  //邮箱
  email: string;

  //岗位
  positions: string;
}

/**
 * 菜单数据
 */
export class MenuData {

  //名称
  name: string;

  //关键字
  code: string;

  //图标
  icon: string;

  //URL
  routerLink?: string;

  //子节点
  children?: Array<MenuData>;

}


