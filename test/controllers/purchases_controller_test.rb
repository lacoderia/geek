require 'test_helper'

class PurchasesControllerTest < ActionController::TestCase
  setup do
    @purchase = purchases(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:purchases)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create purchase" do
    assert_difference('Purchase.count') do
      post :create, purchase: { amount: @purchase.amount, authorization: @purchase.authorization, creation_date: @purchase.creation_date, currency: @purchase.currency, customer_id: @purchase.customer_id, description: @purchase.description, error_message: @purchase.error_message, is_card: @purchase.is_card, method: @purchase.method, openpay_id: @purchase.openpay_id, operation_type: @purchase.operation_type, order_id: @purchase.order_id, status: @purchase.status, transaction_type: @purchase.transaction_type }
    end

    assert_redirected_to purchase_path(assigns(:purchase))
  end

  test "should show purchase" do
    get :show, id: @purchase
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @purchase
    assert_response :success
  end

  test "should update purchase" do
    patch :update, id: @purchase, purchase: { amount: @purchase.amount, authorization: @purchase.authorization, creation_date: @purchase.creation_date, currency: @purchase.currency, customer_id: @purchase.customer_id, description: @purchase.description, error_message: @purchase.error_message, is_card: @purchase.is_card, method: @purchase.method, openpay_id: @purchase.openpay_id, operation_type: @purchase.operation_type, order_id: @purchase.order_id, status: @purchase.status, transaction_type: @purchase.transaction_type }
    assert_redirected_to purchase_path(assigns(:purchase))
  end

  test "should destroy purchase" do
    assert_difference('Purchase.count', -1) do
      delete :destroy, id: @purchase
    end

    assert_redirected_to purchases_path
  end
end
