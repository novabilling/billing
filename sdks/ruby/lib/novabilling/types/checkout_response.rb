# frozen_string_literal: true

module Novabilling
  module Types
    class CheckoutResponse < Internal::Types::Model
      field :checkout_url, -> { String }, optional: false, nullable: false, api_name: "checkoutUrl"
      field :payment_id, -> { String }, optional: false, nullable: false, api_name: "paymentId"
      field :provider, -> { String }, optional: false, nullable: false
      field :expires_at, -> { String }, optional: false, nullable: false, api_name: "expiresAt"
    end
  end
end
