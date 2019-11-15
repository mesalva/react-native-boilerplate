import { createAppContainer } from "react-navigation"
import { createBottomTabNavigator } from 'react-navigation-tabs'
import FBLogin from "../Login/FBLogin"
import GoogleLogin from "../Login/GoogleLogin"

const LoginTab = createAppContainer(
  createBottomTabNavigator(
    {
      FBLogin: FBLogin,
      GoogleLogin:GoogleLogin,
    },
    {
      tabBarOptions: {
        activeBackgroundColor: "#ddd",
        inactiveBackgroundColor: "#fff"
      }
    }
  )
)

export default LoginTab
