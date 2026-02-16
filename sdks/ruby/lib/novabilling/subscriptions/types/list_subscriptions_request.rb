# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class ListSubscriptionsRequest < Internal::Types::Model
        field :status, -> { String }, optional: true, nullable: false
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :plan_id, -> { String }, optional: true, nullable: false, api_name: "planId"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
