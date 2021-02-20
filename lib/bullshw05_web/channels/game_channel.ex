defmodule Bullshw05Web.GameChannel do
  use Bullshw05Web, :channel

  @impl true
  def join("game:" <> _id, payload, socket) do
    if authorized?(payload) do
      game = Bullshw05.Bullsgame.new()
      socket = assign(socket, :game, game)
      view = Bullshw05.Bullsgame.view(game)
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (game:lobby).
  @impl true
  def handle_in("guess", %{"guess" => ll}, socket) do
    game0 = socket.assigns[:game]
    game1 = Bullshw05.Bullsgame.guess(game0, ll)
    socket = assign(socket, :game, game1)
    view = Bullshw05.Bullsgame.view(game1)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("guess", %{"view" => ll}, socket) do
    game0 = socket.assigns[:game]
    game1 = Bullshw05.Bullsgame.echo(game0, ll)
    socket = assign(socket, :game, game1)
    view = Bullshw05.Bullsgame.view(game1)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("guess", %{}, socket) do
    game0 = socket.assigns[:game]
    game1 = Bullshw05.Bullsgame.new()
    socket = assign(socket, :game, game1)
    view = Bullshw05.Bullsgame.view(game1)
    {:reply, {:ok, view}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
