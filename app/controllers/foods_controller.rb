class FoodsController < ApplicationController
  def index
    q = params[:q]

    if q.blank?
      render(
        status: 200,
        json: Food.all.limit(100)
      )
    else
      render(
        status: 200,
        json: Food.where(["description LIKE ?", "%#{q}%"]).limit(100)
      )
    end
  end
end
