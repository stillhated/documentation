import React from 'react'
import {Box} from '@primer/react'
import {Link as GatsbyLink} from 'gatsby'
import {NavList} from '@primer/react/drafts'
import {LinkExternalIcon} from '@primer/octicons-react'
import * as getNav from '../util/get-nav'
import VisuallyHidden from './visually-hidden'
import headerNavItems from '../../content/header-nav.yml'
import usePage from '../hooks/use-page'

const NavItem = ({item, path, ...props}) => {
  const href = getNav.getLocation(item.url)
  const isCurrent = getNav.isActiveUrl(path, href)
  const items = getNav.getHierarchy(item, {path: item.url, hideVariants: true})

  return (
    <NavList.Item
      as={GatsbyLink}
      to={href}
      defaultOpen={items && isCurrent}
      aria-current={isCurrent ? 'page' : null}
      sx={{fontSize: 1}}
    >
      {item.title}
      {items ? (
        <NavList.SubNav>
          <NavItems items={items} path={path} {...props} />
        </NavList.SubNav>
      ) : null}
    </NavList.Item>
  )
}

const NavItems = ({items, path, depth = 1}) => (
  <>
    {items.map(item =>
      depth === 1 ? (
        <NavList.Group key={item.title}>
          <NavItem key={item.title} item={item} path={path} depth={depth + 1} />
        </NavList.Group>
      ) : (
        <NavItem key={item.title} item={item} path={path} depth={depth + 1} />
      ),
    )}
  </>
)

const ExternalNavItem = ({title, ...props}) => (
  <NavList.Item {...props}>
    {title}
    <NavList.TrailingVisual>
      <LinkExternalIcon />
    </NavList.TrailingVisual>
  </NavList.Item>
)

const Navigation = () => {
  const {
    location,
    pageContext: {repositoryUrl},
  } = usePage()
  const path = getNav.getLocation(location.pathname)
  const items = getNav.getHierarchy(null, {path, hideVariants: true})

  return (
    <>
      <VisuallyHidden>
        <h3>Site navigation</h3>
      </VisuallyHidden>
      <NavList aria-label="Site">
        <NavItems items={items} path={path} />
        <NavList.Divider />
        {headerNavItems.map(item => (
          <Box key={item.title} sx={{display: ['flex', null, null, 'none']}}>
            <ExternalNavItem title={item.title} href={item.url} />
          </Box>
        ))}
        <ExternalNavItem title="GitHub" href={repositoryUrl} />
      </NavList>
    </>
  )
}

export default Navigation