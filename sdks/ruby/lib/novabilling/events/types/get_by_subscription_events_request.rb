# frozen_string_literal: true

module Novabilling
  module Events
    module Types
      class GetBySubscriptionEventsRequest < Internal::Types::Model
        field :subscription_id, -> { String }, optional: false, nullable: false, api_name: "subscriptionId"
        field :code, -> { String }, optional: true, nullable: false
        field :from, -> { String }, optional: true, nullable: false
        field :to, -> { String }, optional: true, nullable: false
        field :page, -> { Integer }, optional: true, nullable: false
        field :per_page, -> { Integer }, optional: true, nullable: false, api_name: "perPage"
      end
    end
  end
end
