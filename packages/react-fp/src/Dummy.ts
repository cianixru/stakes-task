import React from 'react'

export default <T>(props: T) =>
  React.createElement('span', { children: JSON.stringify(props) })
