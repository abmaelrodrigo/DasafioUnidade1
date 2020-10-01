let tabUsers = null;
let tabStatistics = null;
let userInput = null;
let searchButton = null;

let allUsers = [];
let filteredUsers = [];
let organizedUserList = [];

let userToBeSearched = '';
let maleQuantity = 0;
let femaleQuantity = 0;
let totalAgesSum = 0;
let agesAverage = 0;
let totalUsers = '';

window.addEventListener('load', () => {
  tabUsers = document.querySelector('#tabUsers');
  tabStatistics = document.querySelector('#tabStatistics');
  totalUsers = document.querySelector('#totalUsers');
  totalStatistics = document.querySelector('#totalStatistics');

  userInput = document.querySelector('#user-input');
  userInput.addEventListener('keyup', getKeyValue);

  searchButton = document.querySelector('#search-btn');
  searchButton.addEventListener('submit', preventSubmit);
  searchButton.addEventListener('click', preventSubmit);

  fetchUsers();
  render();
});

function preventSubmit(event) {
  event.preventDefault();
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsers = json.results
    .map((user) => {
      const { firstName, lastName, picture, age, gender } = user;

      return {
        firstName: user.name.first,
        lastName: user.name.last,
        picture: user.picture.thumbnail,
        age: user.dob.age,
        gender: user.gender,
      };
    })
    .sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
}

function render() {
  renderFilteredUsersList();
  cleanQuantities();
}

function cleanQuantities() {
  maleQuantity = 0;
  femaleQuantity = 0;
  totalAgesSum = 0;
}

function renderFilteredUsersList() {
  let usersHTML = '<div>';

  allUsers.forEach((user) => {
    const { firstName, lastName, picture, age, gender } = user;
    let firstAndLastName = firstName + ' ' + lastName;
    let regex = new RegExp(userToBeSearched, 'i');

    if (firstAndLastName.search(regex) >= 0) {
      const userHTML = ` 
      <div class='user'>
      
      <div>
        <img src="${picture}" alt="${firstName}">
      </div>
      <div>
        <ul>
          <li>${firstName + ' ' + lastName + ', ' + age + ' anos'} </li>
        </ul>
      </div>
    </div>  
      `;
      usersHTML += userHTML;
      renderStatiticsList(gender, age);
    }
  });
  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;

  if (maleQuantity + femaleQuantity <= 0) {
    nothingFound();
  }
}

function nothingFound() {
  totalUsers.textContent = 'Nenhum usuário filtrado';
  totalStatistics.textContent = 'Nada a ser exibido';
  tabStatistics.innerHTML = '<div> </div>';
}

function renderStatiticsList(gender, age) {
  let statisticsHTML = '<div>';
  if (gender === 'male') {
    maleQuantity++;
  }
  if (gender === 'female') {
    femaleQuantity++;
  }

  totalUsers.textContent =
    maleQuantity + femaleQuantity + ' usuário(s) encontrado(s)';
  totalStatistics.textContent = 'Estatísticas';

  totalAgesSum += age;

  statisticsHTML = ` 
  <div class='statistics'>

  <div>
    <ul>
      <li>Sexo masculino: ${maleQuantity} </li>
      <li>Sexo feminino: ${femaleQuantity} </li>
      <li>Soma das idades: ${totalAgesSum.toLocaleString('pt-BR')} </li>
      <li>Média das idades: ${(
        totalAgesSum /
        (femaleQuantity + maleQuantity)
      ).toFixed(2)} </li>
    </ul>
  </div>
</div>  
  `;

  statisticsHTML += '</div>';
  tabStatistics.innerHTML = statisticsHTML;
}

function getKeyValue(event) {
  userToBeSearched = event.target.value;

  if (event.keyCode === 13) {
    render();
  }
}
