export default function RulesScreen({ onBack }) {
    return (
        <div className="screen rules-screen styled-rules">
          <h2 className="subtitle">Правила игры</h2>
          <ul className="rules-list">
            <li>Цель игры - остаться последним игроком с "картами жизни".</li>
            <li>Каждый игрок начинает с 5 "картами жизни" и двумя картами в руке.</li>
            <li>Игроки по очереди выкладывают карту, суммируя её значение с текущей суммой на столе.</li>
            <li>Если сумма превышает 21, игрок теряет "карту жизни" и начинается новый раунд.</li>
            <li>После каждого раунда игроки добирают карты до двух в руке.</li>
            <li>В игре присутствуют специальные карты, влияющие на ход игры.</li>
            <li>Игра продолжается, пока не останется один игрок с "картами жизни".</li>
          </ul>
          <button className="button" onClick={onBack}>Назад</button>
        </div>
      );
}