export const AVATARS = [
  {
    id: 'vibrent_1',
    name: 'Vibrent 1',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_1.png" xlink:href="./assets/avatars/vibrent_1.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  },
  {
    id: 'vibrent_2',
    name: 'Vibrent 2',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_2.png" xlink:href="./assets/avatars/vibrent_2.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  },
  {
    id: 'vibrent_3',
    name: 'Vibrent 3',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_3.png" xlink:href="./assets/avatars/vibrent_3.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  },
  {
    id: 'vibrent_4',
    name: 'Vibrent 4',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_4.png" xlink:href="./assets/avatars/vibrent_4.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  },
  {
    id: 'vibrent_5',
    name: 'Vibrent 5',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_5.png" xlink:href="./assets/avatars/vibrent_5.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  },
  {
    id: 'vibrent_6',
    name: 'Vibrent 6',
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><image href="./assets/avatars/vibrent_6.png" xlink:href="./assets/avatars/vibrent_6.png" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></svg>`
  }
];

export const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[index] || AVATARS[0];
};

export const getAvatarById = (id) => {
  if (!id || id === 'default') {
    return AVATARS[0];
  }
  const found = AVATARS.find(a => a.id === id);
  if (found) return found;
  return AVATARS[0];
};

export const getAvatarSvg = (id) => {
  const item = getAvatarById(id);
  return item.svg;
};

export const getAvatarName = (id) => {
  const item = getAvatarById(id);
  return item.name;
};
