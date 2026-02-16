# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class ApplyAddOnDto < Internal::Types::Model
        field :add_on_id, -> { String }, optional: false, nullable: false, api_name: "addOnId"
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
        field :amount, -> { Integer }, optional: false, nullable: false
        field :currency, -> { String }, optional: false, nullable: false
      end
    end
  end
end
