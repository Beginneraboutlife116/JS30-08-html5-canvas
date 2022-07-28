import backgroundImg from "/src/img/background.png"
import shopImg from "/src/img/shop.png"
import samuraiMackIdleImg from "/src/img/samuraiMack/Idle.png"
import samuraiMackRunImg from "/src/img/samuraiMack/Run.png"
import samuraiMackJumpImg from "/src/img/samuraiMack/Jump.png"
import samuraiMackFallImg from "/src/img/samuraiMack/Fall.png"
import samuraiMackAttackImg from "/src/img/samuraiMack/Attack1.png"
import samuraiMackTakeHitImg from "/src/img/samuraiMack/Take Hit - white silhouette.png"
import samuraiMackDeathImg from "/src/img/samuraiMack/Death.png"

import kenjiIdleImg from "/src/img/kenji/Idle.png"
import kenjiRunImg from "/src/img/kenji/Run.png"
import kenjiJumpImg from "/src/img/kenji/Jump.png"
import kenjiFallImg from "/src/img/kenji/Fall.png"
import kenjiAttackImg from "/src/img/kenji/Attack1.png"
import kenjiTakeHitImg from "/src/img/kenji/Take hit.png"
import kenjiDeathImg from "/src/img/kenji/Death.png"

const images = {
  background: backgroundImg,
  shop: shopImg,
  samuraiMack: {
    idle: samuraiMackIdleImg,
    run: samuraiMackRunImg,
    jump: samuraiMackJumpImg,
    fall: samuraiMackFallImg,
    attack: samuraiMackAttackImg,
    takeHit: samuraiMackTakeHitImg,
    death: samuraiMackDeathImg
  },
  kenji: {
    idle: kenjiIdleImg,
    run: kenjiRunImg,
    jump: kenjiJumpImg,
    fall: kenjiFallImg,
    attack: kenjiAttackImg,
    takeHit: kenjiTakeHitImg,
    death: kenjiDeathImg
  }
}

export default images