<template>
  <div>
    <div id="header">
      <h1>VM converter</h1>
      <div id="navbuttons">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/host/list">Hosts</NuxtLink>
        <NuxtLink to="/task/list">Tasks</NuxtLink>
        </div>
    </div>
    <div id="content">
      <NuxtPage />
    </div>
  </div>
</template>
