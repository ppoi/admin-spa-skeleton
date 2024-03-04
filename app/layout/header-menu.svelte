<script>
  import session from "../core/session";
    import { loading } from "../widgets/loading-screen.svelte";

  function logout() {
    $loading = true;
    session.logout().finally(()=>{
      $loading = false;
      session.authenticate();
    });
  }
</script>
<nav class="main-header navbar navbar-expand navbar-white navbar-light">
  <!-- Left navbar links -->
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" data-widget="pushmenu" href="/" role="button"><i class="fas fa-bars"></i></a>
    </li>
  </ul>

  <!-- Right navbar links -->
  <ul class="navbar-nav ml-auto">
    <!-- Login User Menu -->
    {#if !session.isAnonymous()}
    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href="/">
        <i class="fas fa-user-circle"></i>
        {session.user.username}
        <span class="caret"></span>
      </a>
      <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <a href="/profile" class="dropdown-item">
          プロフィール編集
        </a>
        <div class="dropdown-divider"></div>
        <a href="/logout" class="dropdown-item" on:click|preventDefault={logout}>
          ログアウト
        </a>
      </div>
    </li>
    {/if}
  </ul>
</nav>