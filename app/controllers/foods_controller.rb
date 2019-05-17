class FoodsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    @food = Food.new(permitted_params)
    @food.save
    puts @food.inspect
    render json: @food.as_json
  end

  def index
    q = params[:q]

    if q.blank?
      render(
        status: 200,
        json: Food.all.limit(100).order('created_at DESC')
      )
    else
      render(
        status: 200,
        json: Food.where(["description LIKE ?", "%#{q}%"]).limit(100).order('created_at DESC')
      )
    end
  end

  private

  def permitted_params
    params.require(:food).permit(:description)
  end
end
