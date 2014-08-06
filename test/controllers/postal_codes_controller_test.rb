require 'test_helper'

class PostalCodesControllerTest < ActionController::TestCase
  setup do
    @postal_code = postal_codes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:postal_codes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create postal_code" do
    assert_difference('PostalCode.count') do
      post :create, postal_code: { city_id: @postal_code.city_id, code: @postal_code.code, state_id: @postal_code.state_id }
    end

    assert_redirected_to postal_code_path(assigns(:postal_code))
  end

  test "should show postal_code" do
    get :show, id: @postal_code
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @postal_code
    assert_response :success
  end

  test "should update postal_code" do
    patch :update, id: @postal_code, postal_code: { city_id: @postal_code.city_id, code: @postal_code.code, state_id: @postal_code.state_id }
    assert_redirected_to postal_code_path(assigns(:postal_code))
  end

  test "should destroy postal_code" do
    assert_difference('PostalCode.count', -1) do
      delete :destroy, id: @postal_code
    end

    assert_redirected_to postal_codes_path
  end
end
