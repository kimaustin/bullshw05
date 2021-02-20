defmodule Bullshw05Web.PageController do
  use Bullshw05Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
