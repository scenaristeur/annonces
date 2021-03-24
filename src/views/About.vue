<template>
  <div class="about">
    <p>Bon-prix is "classified ads" app based on <a href="https://github.com/solid/specification" target="_blank">Solid specifications</a>, made with vuejs.</p>
    <p>
      The Solid specification aims to provide a POD for each user where he stores and manage its data.
      <br>
      If you don't have a POD,
      you can create one on <a href="https://solidcommunity.net/" target="_blank">Solid Community</a> or
      use this <a href="https://scenaristeur.github.io/solid-vue-panes/providers" target="_blank">list of providers</a>.
    </p>

    <ul>
      <li>
        When you add an annonce, it is stored on your POD in the /public/annonces/ folder of your POD.
      </li>
      <li>
        Then a notification is send to <a href="https://agora.solidcommunity.net/public/Annonce/annonces/" target="_blank">
          https://agora.solidcommunity.net/public/Annonce/annonces/</a> 
        </li>
      </ul>

      <a href="https://github.com/scenaristeur/bon-prix/" target="_blank">Source Code</a>
    </div>
  </template>
