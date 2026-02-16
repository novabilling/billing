# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class ListAppliedAddOnsRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :invoiced, -> { Internal::Types::Boolean }, optional: true, nullable: false
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
