import React from 'react'
import { Dialog, InputGroup, Button, IDialogProps, Intent } from '@blueprintjs/core'

import authApis from 'apis/auth'
import useAsyncFn from 'hooks/useAsyncFn'
import { noop } from 'helpers/fn'
import { LogDispatchContext, ACTIONS } from 'reducers/log'
import styles from './style.module.css'

interface IProps extends IDialogProps {
  onClose: () => void
}

const { useState, useContext } = React

const LoginDialog: React.FC<IProps> = ({ isOpen, onClose = noop }) => {
  const dispatch = useContext(LogDispatchContext)
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginState, loginFn] = useAsyncFn(authApis.login)
  const { loading, error } = loginState

  const [phoneIntent, setPhoneIntent] = useState<Intent>('primary')
  const [passWordIntent, setpassWordIntent] = useState<Intent>('primary')

  const handleLogin = async () => {
    // 原函数没有判断输入为空，显然不合理
    setPhoneIntent((_) => (phone ? 'primary' : 'danger'))
    setpassWordIntent((_) => (password ? 'primary' : 'danger'))
    if (!(phone && password)) {
      return
    }

    const result = await loginFn({ phone, password })
    if (result) {
      dispatch({
        type: ACTIONS.LOGIN,
        payload: {
          user: {
            ...result,
            userId: result.profile.userId,
          },
        },
      })
      onClose()
    }
  }

  return (
    <Dialog style={{ width: '400px' }} title='登录' isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <InputGroup
          placeholder='请输入手机号'
          leftIcon='mobile-phone'
          value={phone}
          intent={phoneIntent}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPhone(event.target.value)
          }}
        />
        <InputGroup
          placeholder='请输入密码'
          leftIcon='lock'
          type='password'
          intent={passWordIntent}
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value)
          }}
        />
        {error && <div className='error'>{error.message}</div>}

        <div className={styles.loginBtn}>
          <Button onClick={handleLogin} loading={loading}>
            登录
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default LoginDialog
